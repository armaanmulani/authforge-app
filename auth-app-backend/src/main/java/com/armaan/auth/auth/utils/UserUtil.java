package com.armaan.auth.auth.utils;

import java.util.UUID;

public class UserUtil {

    public static UUID pasrseUUID(String uuid) {
        return UUID.fromString(uuid);
    }

}
