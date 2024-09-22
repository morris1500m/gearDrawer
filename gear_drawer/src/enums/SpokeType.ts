export enum SpokeType {
    Straight = "Straight",
    Rounded = "Rounded",
    Tapered = "Tapered",
    None = "None",
}

export function getSpokeTypeFromString(value: string): SpokeType | undefined {
    const enumValues = Object.values(SpokeType) as string[];
    if (enumValues.includes(value)) {
      return SpokeType[value as keyof typeof SpokeType];
    }
    return undefined;
  }