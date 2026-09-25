import type { PageTitleProps } from "@/types/props";

export function PageTitle(props: PageTitleProps) {
  const { title } = props;

  return (
    <h1 className="text-5xl p-3 shadow-[0_0.4em_0.75em_-0.6em_#707070]">
      {title}
    </h1>
  )
}
