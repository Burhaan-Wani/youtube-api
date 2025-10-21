exports.getEnv = (key, defaultValue = "") => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue) {
      return defaultValue && !isNaN(defaultValue)
        ? Number(defaultValue)
        : defaultValue;
    }
  }
  return value;
};
