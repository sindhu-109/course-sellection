export default function EmptyState({ title, desc }) {
  return (
    <div className="emptyWrap">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
