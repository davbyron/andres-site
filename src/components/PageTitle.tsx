import type { PageTitleProps } from "@/types/props";

export function PageTitle(props: PageTitleProps) {
  const { title } = props;

  return (
    <h1
      className="
        text-center text-[2rem] p-2 shadow-[0_0.8em_0.75em_-0.9em_#707070]
        lg:text-left lg:text-5xl lg:p-3 lg:shadow-[0_0.4em_0.75em_-0.6em_#707070]
      "
    >
      {title}
    </h1>
  )
}
