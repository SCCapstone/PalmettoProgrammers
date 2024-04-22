/* Calculates time difference for chat messages based on when they were sent
 * Ie a message sent 3 days ago should display '3 days' rather than
 * '4320 minutes'
 */
const timeDifference = (timestamp) => {
  const messageDate = new Date(timestamp);
  const currentTimestamp = Date.now();

  const difference = currentTimestamp - messageDate.getTime();

  if (difference <= 0) {
    return 'Just now';
  }

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
};

const DateUtils = {
  timeDifference,
};

export default DateUtils;
