export const fileToBase64 = (file: File): Promise<ArrayBuffer | string> => new Promise((
  resolve,
  reject
) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});
