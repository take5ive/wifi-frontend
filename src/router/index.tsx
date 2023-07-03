import ROUTES from "./route-names";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "pages/home";
import { Gather } from "pages/gather";
import { Invest } from "pages/invest";
import GatherTx from "pages/gather-tx";
import InvestTx from "pages/invest-tx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.GATHER} element={<Gather />} />
        <Route path={ROUTES.GATHER_TX} element={<GatherTx />} />
        <Route path={ROUTES.INVEST} element={<Invest />} />
        <Route path={ROUTES.INVEST_TX} element={<InvestTx />} />
      </Routes>
    </BrowserRouter>
  );
}
