import "../sass/style.scss";

import { $, $$ } from "./modules/bling"; //This is not jQuery
import autocomplete from "./modules/autocomplete";

autocomplete($("#address"), $("#lat"), $("#lng"));
