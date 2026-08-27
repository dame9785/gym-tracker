export function calculateAge(birthDate: Date | string): number {
  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference = today.getMonth() - birth.getMonth();

  const hasNotHadBirthdayYet = monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate());

  if (hasNotHadBirthdayYet) {
    age--;
  }

  return age;
}
