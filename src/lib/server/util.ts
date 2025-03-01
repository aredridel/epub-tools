import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export function randomID<T extends string>(type: T): `${T}-${string}` {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return `${type}-${token}`;
}
