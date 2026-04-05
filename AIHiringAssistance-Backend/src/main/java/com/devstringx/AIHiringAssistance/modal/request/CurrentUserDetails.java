//package com.devstringx.AIHiringAssistance.modal.request;
//
//import com.devstringx.AIHiringAssistance.enums.UserType;
//import lombok.Data;
//
//@Data
//public class CurrentUserDetails {
//    private String userId;
//    private String fullName;
//    private String email;
//    private UserType userType;
//
//    public CurrentUserDetails(String userId, String fullName, String email, UserType userType) {
//        this.userId = userId;
//        this.fullName = fullName;
//        this.email = email;
//        this.userType = userType;
//    }
//
//
//}

package com.devstringx.AIHiringAssistance.modal.request;

import com.devstringx.AIHiringAssistance.enums.UserType;
import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentUserDetails {
    private UserEntity userEntity;
    private String userId;
    private String fullName;
    private UserType userType;
}
