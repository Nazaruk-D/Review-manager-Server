export function parseFormData(formData: FormData): { [key: string]: any } {
    const obj: { [key: string]: any } = {};
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            obj[key] = value;
        } else {
            obj[key] = value || '';
        }
    }
    return obj;
}