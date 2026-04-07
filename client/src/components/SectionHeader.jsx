function SectionHeader({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`max-w-4xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "#f59e0b" }}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
        {title}
      </h2>
      {description && (
        <p
          className="max-w-xl leading-relaxed text-base"
          style={{ color: "#737373" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
