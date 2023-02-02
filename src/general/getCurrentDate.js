export function GetCurrentDate() {
  let date = new Date();

  return date.toLocaleDateString("en-US");
}
