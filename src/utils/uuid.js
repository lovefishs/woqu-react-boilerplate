const replacer = (c) => {
  const r = Math.random() * 16 | 0
  const v = c === 'x' ? r : (r & 0x3 | 0x8)

  return v.toString(16)
}

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replacer)

export default uuid
