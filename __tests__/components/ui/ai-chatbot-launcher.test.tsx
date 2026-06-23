import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIChatbotLauncher } from "@/components/ui/ai-chatbot-launcher";

describe("AIChatbotLauncher", () => {
  it("renders open and scroll-to-top buttons with new message badge", async () => {
    const onOpen = jest.fn();
    const onScrollTop = jest.fn();

    render(
      <AIChatbotLauncher
        showScrollTop={true}
        isOpen={false}
        hasNewMessage={true}
        onOpen={onOpen}
        onScrollTop={onScrollTop}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    const [scrollButton, openButton] = buttons;

    await userEvent.click(scrollButton);
    expect(onScrollTop).toHaveBeenCalled();

    await userEvent.click(openButton);
    expect(onOpen).toHaveBeenCalled();
  });

  it("hides the launch button when the chat window is already open", () => {
    render(
      <AIChatbotLauncher
        showScrollTop={true}
        isOpen={true}
        hasNewMessage={false}
        onOpen={jest.fn()}
        onScrollTop={jest.fn()}
      />,
    );

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
