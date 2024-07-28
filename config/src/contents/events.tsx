import { SmileySad } from "@phosphor-icons/react/dist/ssr/SmileySad";

interface EventsProps {
  mensagem: string;
}

function Events({ mensagem }: EventsProps) {
  return (
    <section className="_div _ops">
      <SmileySad />
      <p>{mensagem}</p>
    </section>
  );
}

export default Events;