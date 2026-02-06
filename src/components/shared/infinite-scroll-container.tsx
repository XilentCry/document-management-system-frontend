import { useInView } from "react-intersection-observer";

export function InfiniteScrollContainer({
  children,
  onBottomReached,
}: {
  children: React.ReactNode;
  onBottomReached: () => void;
}) {
  const { ref } = useInView({
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });

  return (
    <>
      {children}
      <div ref={ref} />
    </>
  );
}
