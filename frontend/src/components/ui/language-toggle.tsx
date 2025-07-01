import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };
  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 rounded text-xs font-semibold border transition-colors duration-200 ${
          i18n.language === "en"
            ? "bg-primary text-white border-primary"
            : "bg-background text-foreground border-border hover:bg-accent"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className={`px-2 py-1 rounded text-xs font-semibold border transition-colors duration-200 ${
          i18n.language === "ar"
            ? "bg-primary text-white border-primary"
            : "bg-background text-foreground border-border hover:bg-accent"
        }`}
      >
        العربية
      </button>
    </div>
  );
}
