export const errorNotification = (error) => {
  if (error) {
    UIkit.notification(error);
    return true;
  }
  return false;
};
