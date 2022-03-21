import userActions from "./userActions";
import bookActions from "./bookActions";
import shelfActions from "./shelfActions";
import bookSearchActions from "./bookSearchActions";

export default {
  ...userActions,
  ...bookActions,
  ...shelfActions,
  ...bookSearchActions,
};
