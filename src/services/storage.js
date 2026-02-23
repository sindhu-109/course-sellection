const STORAGE_KEYS = {
  users: "users",
  courses: "courses",
  registrations: "registrations",
  currentUser: "currentUser",
};

const DEFAULT_COURSES = [
  { id: 1, courseName: "Data Structures", faculty: "Dr. Rao", time: "Mon 10:00 AM" },
  { id: 2, courseName: "Database Systems", faculty: "Prof. Singh", time: "Tue 2:00 PM" },
  { id: 3, courseName: "Operating Systems", faculty: "Dr. Mehta", time: "Wed 11:00 AM" },
  { id: 4, courseName: "Computer Networks", faculty: "Prof. Nair", time: "Thu 9:00 AM" },
];

const readJson = (key, fallback) => {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) {
      return fallback;
    }
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const normalizeUser = (user) => ({
  id: user.id ?? Date.now(),
  name: user.name ?? "",
  email: (user.email ?? "").trim().toLowerCase(),
  password: user.password ?? "",
  role: user.role ?? "user",
  status: user.status ?? "Approved",
});

const DAY_LABEL_BY_KEY = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const DAY_KEY_BY_INPUT = {
  mon: "mon",
  monday: "mon",
  tue: "tue",
  tues: "tue",
  tuesday: "tue",
  wed: "wed",
  wednesday: "wed",
  thu: "thu",
  thur: "thu",
  thurs: "thu",
  thursday: "thu",
  fri: "fri",
  friday: "fri",
  sat: "sat",
  saturday: "sat",
  sun: "sun",
  sunday: "sun",
};

const parseClockTimeToMinutes = (timeText) => {
  if (!timeText) {
    return null;
  }

  const match = timeText.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2] || "0");
  const meridiem = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  const adjustedHours = hours % 12 + (meridiem === "PM" ? 12 : 0);
  return adjustedHours * 60 + minutes;
};

const formatMinutesAsClock = (minutes) => {
  const normalizedMinutes = Math.max(0, minutes);
  const hour24 = Math.floor(normalizedMinutes / 60) % 24;
  const minute = normalizedMinutes % 60;
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, "0")} ${meridiem}`;
};

export const parseCourseTimeRange = (courseTime) => {
  if (!courseTime || typeof courseTime !== "string") {
    return null;
  }

  const normalizedText = courseTime.replace(/\s+/g, " ").trim();
  const dayMatch = normalizedText.match(
    /^(Mon(?:day)?|Tue(?:s|sday)?|Wed(?:nesday)?|Thu(?:r|rs|rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?)\s+(.+)$/i
  );

  if (!dayMatch) {
    return null;
  }

  const dayInput = dayMatch[1].toLowerCase();
  const dayKey = DAY_KEY_BY_INPUT[dayInput];
  if (!dayKey) {
    return null;
  }

  const timePart = dayMatch[2].trim();
  const [startTextRaw, endTextRaw] = timePart.split(/\s*[-–]\s*/);

  const startMinutes = parseClockTimeToMinutes(startTextRaw);
  if (startMinutes == null) {
    return null;
  }

  let endMinutes = endTextRaw ? parseClockTimeToMinutes(endTextRaw) : startMinutes + 60;
  if (endMinutes == null) {
    return null;
  }

  if (endMinutes <= startMinutes) {
    endMinutes = startMinutes + 60;
  }

  return {
    dayKey,
    dayLabel: DAY_LABEL_BY_KEY[dayKey],
    startMinutes,
    endMinutes,
    normalizedLabel: `${DAY_LABEL_BY_KEY[dayKey]} ${formatMinutesAsClock(startMinutes)} - ${formatMinutesAsClock(endMinutes)}`,
  };
};

const registrationsOverlap = (firstRegistration, secondRegistration) => {
  const firstTime = parseCourseTimeRange(firstRegistration.courseTime);
  const secondTime = parseCourseTimeRange(secondRegistration.courseTime);

  if (!firstTime || !secondTime) {
    return null;
  }

  if (firstTime.dayKey !== secondTime.dayKey) {
    return null;
  }

  const overlaps =
    firstTime.startMinutes < secondTime.endMinutes &&
    secondTime.startMinutes < firstTime.endMinutes;

  if (!overlaps) {
    return null;
  }

  const overlapStart = Math.max(firstTime.startMinutes, secondTime.startMinutes);
  const overlapEnd = Math.min(firstTime.endMinutes, secondTime.endMinutes);

  return {
    dayLabel: firstTime.dayLabel,
    overlapStart,
    overlapEnd,
  };
};

export const getScheduleConflicts = (registrationsWithDetails) => {
  const approvedRegistrations = registrationsWithDetails.filter(
    (registration) => registration.status === "Approved"
  );

  const conflicts = [];

  for (let firstIndex = 0; firstIndex < approvedRegistrations.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < approvedRegistrations.length; secondIndex += 1) {
      const firstRegistration = approvedRegistrations[firstIndex];
      const secondRegistration = approvedRegistrations[secondIndex];

      if (firstRegistration.studentEmail !== secondRegistration.studentEmail) {
        continue;
      }

      const overlapDetails = registrationsOverlap(firstRegistration, secondRegistration);
      if (!overlapDetails) {
        continue;
      }

      const courseIds = [firstRegistration.courseId, secondRegistration.courseId].sort((a, b) => a - b);

      conflicts.push({
        id: `${firstRegistration.studentEmail}-${courseIds[0]}-${courseIds[1]}`,
        student: firstRegistration.student,
        studentEmail: firstRegistration.studentEmail,
        courseIds,
        courseNames: [firstRegistration.courseName, secondRegistration.courseName],
        timeAlert: `${overlapDetails.dayLabel} ${formatMinutesAsClock(overlapDetails.overlapStart)} - ${formatMinutesAsClock(overlapDetails.overlapEnd)}`,
        message: `${firstRegistration.courseName} overlaps with ${secondRegistration.courseName}`,
      });
    }
  }

  return conflicts;
};

export const initializeStorage = () => {
  const storedCourses = readJson(STORAGE_KEYS.courses, null);
  if (!storedCourses || !Array.isArray(storedCourses) || storedCourses.length === 0) {
    writeJson(STORAGE_KEYS.courses, DEFAULT_COURSES);
  }

  const existingUsers = readJson(STORAGE_KEYS.users, []);
  const legacyUser = readJson("user", null);

  const normalizedUsers = (
    existingUsers.length ? existingUsers : legacyUser ? [legacyUser] : []
  ).map(normalizeUser);

  writeJson(STORAGE_KEYS.users, normalizedUsers);

  const registrations = readJson(STORAGE_KEYS.registrations, null);
  if (!registrations || !Array.isArray(registrations)) {
    writeJson(STORAGE_KEYS.registrations, []);
  }
};

export const getUsers = () => readJson(STORAGE_KEYS.users, []);

export const saveUsers = (users) => {
  writeJson(STORAGE_KEYS.users, users.map(normalizeUser));
};

export const registerUser = (userData) => {
  const users = getUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();
  const alreadyExists = users.some((savedUser) => savedUser.email === normalizedEmail);

  if (alreadyExists) {
    return { ok: false, message: "This email is already registered. Please login." };
  }

  const newUser = normalizeUser({ ...userData, id: Date.now() });
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  localStorage.setItem("user", JSON.stringify(newUser));

  return { ok: true, user: newUser };
};

export const authenticateUser = (email, password) => {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  return (
    users.find(
      (savedUser) => savedUser.email === normalizedEmail && savedUser.password === password
    ) ?? null
  );
};

export const getCurrentUser = () => readJson(STORAGE_KEYS.currentUser, null);

export const setCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    return;
  }
  writeJson(STORAGE_KEYS.currentUser, normalizeUser(user));
};

export const getCourses = () => readJson(STORAGE_KEYS.courses, DEFAULT_COURSES);

export const addCourse = (courseData) => {
  const courses = getCourses();
  const newCourse = {
    id: Date.now(),
    courseName: courseData.courseName,
    faculty: courseData.faculty,
    time: courseData.time,
  };
  const updatedCourses = [...courses, newCourse];
  writeJson(STORAGE_KEYS.courses, updatedCourses);
  return newCourse;
};

export const updateCourse = (courseId, courseData) => {
  const courses = getCourses();
  const updatedCourses = courses.map((course) =>
    course.id === courseId ? { ...course, ...courseData } : course
  );
  writeJson(STORAGE_KEYS.courses, updatedCourses);
};

export const deleteCourse = (courseId) => {
  const courses = getCourses();
  const registrations = getRegistrations();

  const updatedCourses = courses.filter((course) => course.id !== courseId);
  const updatedRegistrations = registrations.filter(
    (registration) => registration.courseId !== courseId
  );

  writeJson(STORAGE_KEYS.courses, updatedCourses);
  writeJson(STORAGE_KEYS.registrations, updatedRegistrations);
};

export const getRegistrations = () => readJson(STORAGE_KEYS.registrations, []);

export const createRegistration = ({ userEmail, courseId }) => {
  const registrations = getRegistrations();
  const normalizedEmail = userEmail.trim().toLowerCase();

  const existingRegistration = registrations.find(
    (registration) =>
      registration.userEmail === normalizedEmail && registration.courseId === courseId
  );

  if (existingRegistration && existingRegistration.status !== "Rejected") {
    return { ok: false, message: "You already requested this course." };
  }

  if (existingRegistration && existingRegistration.status === "Rejected") {
    const updatedRegistrations = registrations.map((registration) =>
      registration.id === existingRegistration.id
        ? { ...registration, status: "Pending", updatedAt: new Date().toISOString() }
        : registration
    );
    writeJson(STORAGE_KEYS.registrations, updatedRegistrations);
    return { ok: true };
  }

  const newRegistration = {
    id: Date.now(),
    userEmail: normalizedEmail,
    courseId,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  writeJson(STORAGE_KEYS.registrations, [...registrations, newRegistration]);
  return { ok: true };
};

export const updateRegistrationStatus = (registrationId, status) => {
  const registrations = getRegistrations();
  const updatedRegistrations = registrations.map((registration) =>
    registration.id === registrationId
      ? { ...registration, status, updatedAt: new Date().toISOString() }
      : registration
  );
  writeJson(STORAGE_KEYS.registrations, updatedRegistrations);
};

export const getRegistrationsWithDetails = () => {
  const registrations = getRegistrations();
  const users = getUsers();
  const courses = getCourses();

  return registrations.map((registration) => {
    const user = users.find((savedUser) => savedUser.email === registration.userEmail);
    const course = courses.find((savedCourse) => savedCourse.id === registration.courseId);

    return {
      ...registration,
      student: user?.name || registration.userEmail,
      studentEmail: registration.userEmail,
      courseName: course?.courseName || "Course removed",
      courseFaculty: course?.faculty || "-",
      courseTime: course?.time || "-",
    };
  });
};

export const getUserRegistrationsWithDetails = (userEmail) => {
  const normalizedEmail = userEmail.trim().toLowerCase();
  return getRegistrationsWithDetails().filter(
    (registration) => registration.studentEmail === normalizedEmail
  );
};

export const updateUserStatus = (userId, status) => {
  const users = getUsers();
  const updatedUsers = users.map((user) =>
    user.id === userId ? { ...user, status } : user
  );
  saveUsers(updatedUsers);
};
