import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { BrowsePage } from "./pages/BrowsePage";
import { PoemDetailPage } from "./pages/PoemDetailPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ChangelogPage } from "./pages/ChangelogPage";

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="app__header">
          <h1 className="app__title">詩の鑑賞</h1>
          <nav className="app__nav">
            <NavLink to="/" end>
              鑑賞
            </NavLink>
            <NavLink to="/search">検索</NavLink>
            {import.meta.env.DEV && <NavLink to="/register">登録</NavLink>}
            <NavLink to="/changelog">📝 更改メモ</NavLink>
          </nav>
        </header>
        <main className="app__main">
          <Routes>
            <Route path="/" element={<BrowsePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/poems/:id" element={<PoemDetailPage />} />
            {import.meta.env.DEV && <Route path="/register" element={<RegisterPage />} />}
            {import.meta.env.DEV && <Route path="/register/:id" element={<RegisterPage />} />}
            <Route path="/changelog" element={<ChangelogPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
