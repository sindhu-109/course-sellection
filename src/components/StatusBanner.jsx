export default function StatusBanner({ type, msg }) {
  if (!msg) {
    return null;
  }

  return <div className={`banner ${type}`}>{msg}</div>;
}
