export const loadData = async (company, filename) => {
  try {
    // A mapping approach to avoid dynamic import variable warnings in Vite
    const modules = import.meta.glob('../data/**/*.json');
    const path = `../data/${company}/${filename}`;
    if (modules[path]) {
      const data = await modules[path]();
      return data.default || data;
    }
    return [];
  } catch (error) {
    console.error(`Failed to load ${filename} for ${company}`, error);
    return [];
  }
};
