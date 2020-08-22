import {GuildMember, PermissionResolvable} from "discord.js";

export default class AuthorizationHelper {
    public static hasPermission(guildMember: GuildMember, permissionResolvable: PermissionResolvable): boolean {
        return guildMember.hasPermission(permissionResolvable);
    }
}
