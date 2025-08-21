const generateUniqueId = (role: "teacher" | "student" | "admin"): string => {
  const prefix = "ips"; // fixed prefix

  const roleMap: Record<typeof role, string> = {
    teacher: "t",
    student: "s",
    admin: "a",
  };

  // Generate a random number part (6 digits to make total length = 10)
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();

  // Build final ID: prefix (3) + randomPart (6) + roleLetter (1) = 10 chars
  return `${prefix}${randomPart}${roleMap[role]}`;
};

export default generateUniqueId;
