import moment from "moment";

const formatTimeString = (timeString) => {
  return moment(timeString, "HH:mm").format("h:mm A");
};

export { formatTimeString };
