import Script from "next/script";

/** Admin panel defaults to dark; only `light` in storage forces light mode. */
const themeInitScript = `
(function () {
  try {
    var mode = localStorage.getItem('zamok_admin_theme');
    var dark = mode !== 'light';
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export function ThemeScript() {
  return (
    <Script
      id="zamok-admin-theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
