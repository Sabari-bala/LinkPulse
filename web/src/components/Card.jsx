export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`card ${hover ? 'hover:shadow-md hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
