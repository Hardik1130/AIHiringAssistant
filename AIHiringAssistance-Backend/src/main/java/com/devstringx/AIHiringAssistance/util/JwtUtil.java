package com.devstringx.AIHiringAssistance.util;


import com.devstringx.AIHiringAssistance.enums.UserType;
import com.devstringx.AIHiringAssistance.exception.JwtAuthenticationException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    @Value("${jwt.aes.key}")
    private String base64AesKey;

    private String encryptWithAES(String data) throws Exception {
        SecretKey aesKey = getAesKey();
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding"); // Explicit mode
        cipher.init(Cipher.ENCRYPT_MODE, aesKey);
        byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
        String encryptedBase64 = Base64.getEncoder().encodeToString(encryptedData);
        return encryptedBase64;
    }

    private String decryptWithAES(String encryptedData) throws Exception {
        SecretKey aesKey = getAesKey();
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, aesKey);
        byte[] decodedBytes = Base64.getDecoder().decode(encryptedData);
        byte[] decryptedBytes = cipher.doFinal(decodedBytes);
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    private SecretKey getAesKey() {
        byte[] decodedKey = Base64.getDecoder().decode(base64AesKey);
        return new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");
    }

    public String generateToken(UserDetails userDetails, String userId, UserType userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("userType", userType.name());
        String jwt = createToken(claims, userDetails.getUsername(), 1000 * 60 * 60 * 24 * 7);
        try {
            String encryptedJwt = encryptWithAES(jwt);
            return encryptedJwt;
        } catch (Exception e) {
            e.printStackTrace();
            return jwt;
        }
    }

    public String generateRefreshToken(UserDetails userDetails, String userId,  UserType userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("userType", userType.name());
        String jwt = createToken(claims, userDetails.getUsername(), 1000 * 60 * 60 * 24 * 14);
        try {
            String encryptedJwt = encryptWithAES(jwt);
            return encryptedJwt;
        } catch (Exception e) {
            e.printStackTrace();
            // fallback: return unencrypted JWT (optional)
            return jwt;
        }
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationMillis) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //    ------------------------------------------------
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }
//    ------------------------------------------------

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUserId(String token) {
        final Claims claims = extractAllClaims(token);
        Object userId = claims.get("userId");
        if (userId == null) {
            return null;
        }

        return userId.toString();
    }

    public UserType extractUserType(String token) {
        Claims claims = extractAllClaims(token);
        String userType = (String) claims.get("userType");
        return UserType.valueOf(userType);
    }

    private Claims extractAllClaims(String encryptedToken) {
        try {
            String decryptedToken = decryptWithAES(encryptedToken);
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(decryptedToken)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new JwtAuthenticationException("Token expired");
        } catch (Exception e) {
            throw new JwtAuthenticationException("Invalid or malformed token");
        }
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails, UserType userType) {
        final String username = extractUsername(token);
        final UserType tokenUserType = extractUserType(token);

        return username.equals(userDetails.getUsername())
                && tokenUserType == userType
                && !isTokenExpired(token);
    }
}

