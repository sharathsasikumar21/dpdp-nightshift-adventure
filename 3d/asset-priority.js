// A failed optional prerequisite must not prevent the next available asset loading.
export function afterAsset(prerequisite, load) {
 return Promise.resolve(prerequisite).catch(()=>{}).then(load);
}
