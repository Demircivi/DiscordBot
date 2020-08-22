export default class StringHelper {
    public static isStringBuildWithNumbersOnly(input: string): boolean {
        return input.match(/^\d+$/) !== null;
    }
}
