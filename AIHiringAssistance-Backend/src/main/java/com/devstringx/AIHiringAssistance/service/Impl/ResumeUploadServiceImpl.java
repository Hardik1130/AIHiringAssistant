package com.devstringx.AIHiringAssistance.service.Impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.entity.Certification;
import com.devstringx.AIHiringAssistance.modal.entity.Education;
import com.devstringx.AIHiringAssistance.modal.entity.Experience;
import com.devstringx.AIHiringAssistance.modal.response.AIParsedProfileResponse;
import com.devstringx.AIHiringAssistance.repository.CandidateProfileRepository;
import com.devstringx.AIHiringAssistance.service.AIProfileParserService;
import com.devstringx.AIHiringAssistance.service.ResumeUploadService;
import com.devstringx.AIHiringAssistance.util.LoggedInUserContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeUploadServiceImpl implements ResumeUploadService {

    private final CandidateProfileRepository repository;
    private final LoggedInUserContext userContext;
    private final Cloudinary cloudinary;
    private final AIProfileParserService aiProfileParserService;
    private AIParsedProfileResponse parsedProfile = null;

    @Transactional
    @Override
    public AIParsedProfileResponse uploadResume(MultipartFile file) {
        String resumeUrl="";
        String userId = userContext.getUserId();

        CandidateProfile profile = repository
                .findByUserIdAndIsSoftDeleteFalse(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        try {
            String originalFilename = file.getOriginalFilename(); // e.g. resume.pdf
            if (originalFilename == null || !originalFilename.contains(".")) {
                throw new RuntimeException("Invalid file");
            }
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            Map result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "raw",
                            "folder", "resumes",
                            "public_id", userId + "_resume", // IMPORTANT
                            "use_filename", false,
                            "unique_filename", false,
                            "overwrite", true
                    )
            );

            resumeUrl = result.get("secure_url").toString();
            String resumeText = extractText(file);
            profile.setResumeFilePath(resumeUrl);
            profile.setResumeText(resumeText);
//            CandidateProfile profile1 = repository.save(profile);
//          Calling AI layer---------------------
             parsedProfile =
                    aiProfileParserService.parseResume(resumeText, resumeUrl);

            mapAndSaveParsedProfile(profile, parsedProfile);

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        parsedProfile.setAvatar(profile.getAvatar());
        return parsedProfile;
    }

    private String extractText(MultipartFile file) {
        try {
            Tika tika = new Tika();
            return tika.parseToString(file.getInputStream());
        } catch (Exception e) {
            throw new RuntimeException("Resume text extraction failed");
        }
    }

    private void mapAndSaveParsedProfile(
            CandidateProfile profile,
            AIParsedProfileResponse parsedProfile
    ) {

        try {

            // 🔹 Basic Fields
            System.out.println("The avatar:- "+profile.getAvatar());
            profile.setCurrentRole(parsedProfile.getRole());
            profile.setLocation(parsedProfile.getLocation());
            profile.setAvatar(profile.getAvatar());
            profile.setAvailability(parsedProfile.getAvailability());
            profile.setExpectedCTC(parsedProfile.getExpectedCTC());
            profile.setSummary(parsedProfile.getSummary());
            profile.setMatchPercentage(parsedProfile.getMatchPercentage());
            profile.setHighestEducation(parsedProfile.getHighestEducation());

            profile.setTotalExperience(
                    parsedProfile.getTotalExperience() != null
                            ? extractYears(parsedProfile.getTotalExperience())
                            : null
            );

            ObjectMapper mapper = new ObjectMapper();
            profile.setSkills(
                    mapper.writeValueAsString(parsedProfile.getSkills())
            );

            profile.setAiInsights(
                    parsedProfile.getAiInsights() != null
                            ? new ArrayList<>(parsedProfile.getAiInsights())
                            : new ArrayList<>()
            );

            // 🔥 SAFE COLLECTION RESET (Hibernate-friendly)

            profile.setEducation(
                    profile.getEducation() == null
                            ? new ArrayList<>()
                            : profile.getEducation()
            );
            if (profile.getEducation() != null) profile.getEducation().clear();

            profile.setCertifications(
                    profile.getCertifications() == null
                            ? new ArrayList<>()
                            : profile.getCertifications()
            );
            if (profile.getCertifications() != null) profile.getCertifications().clear();

            profile.setExperience(
                    profile.getExperience() == null
                            ? new ArrayList<>()
                            : profile.getExperience()
            );
            if (profile.getExperience() != null) profile.getExperience().clear();


            // 🔹 Education Mapping
            if (parsedProfile.getEducation() != null) {

                for (var e : parsedProfile.getEducation()) {

                    Education education = Education.builder()
                            .degree(e.getDegree())
                            .institution(e.getInstitution())
                            .period(e.getPeriod())
                            .candidateProfile(profile)
                            .build();

                    profile.getEducation().add(education);
                }
            }

            // 🔹 Certification Mapping
            if (parsedProfile.getCertifications() != null) {

                for (var c : parsedProfile.getCertifications()) {

                    Certification certification = Certification.builder()
                            .name(c.getName())
                            .issuer(c.getIssuer())
                            .date(c.getDate())
                            .candidateProfile(profile)
                            .build();

                    profile.getCertifications().add(certification);
                }
            }

            // 🔹 Experience Mapping
            if (parsedProfile.getExperience() != null) {

                for (var exp : parsedProfile.getExperience()) {

                    Experience experience = Experience.builder()
                            .title(exp.getTitle())
                            .company(exp.getCompany())
                            .period(exp.getPeriod())
                            .description(
                                    exp.getDescription() != null
                                            ? new ArrayList<>(exp.getDescription())
                                            : new ArrayList<>()
                            )
                            .candidateProfile(profile)
                            .build();

                    profile.getExperience().add(experience);
                }
            }

            repository.save(profile);

        } catch (Exception e) {
            throw new RuntimeException("Failed to map and save AI profile", e);
        }
    }


    private Integer extractYears(String exp) {
        try {
            return Integer.parseInt(exp.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return null;
        }
    }
}


