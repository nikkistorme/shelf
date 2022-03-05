import userActions from "./userActions";
import bookActions from "./bookActions";
import shelfActions from "./shelfActions";

export default {
  ...userActions,
  ...bookActions,
  ...shelfActions,
};
