package com.devstringx.AIHiringAssistance.service.Impl;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ResumeService {

    public byte[] downloadResumes(List<String> resumeUrls) throws IOException {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zipOut = new ZipOutputStream(baos);

        int index = 1;

        for (String url : resumeUrls) {

            URL fileUrl = new URL(url);
            InputStream inputStream = fileUrl.openStream();

            String fileName = "resume_" + index + ".pdf";

            zipOut.putNextEntry(new ZipEntry(fileName));

            byte[] buffer = new byte[1024];
            int len;

            while ((len = inputStream.read(buffer)) > 0) {
                zipOut.write(buffer, 0, len);
            }

            zipOut.closeEntry();
            inputStream.close();

            index++;
        }

        zipOut.close();

        return baos.toByteArray();
    }
}
