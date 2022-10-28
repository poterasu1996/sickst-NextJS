import Footer from './Footer';
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Home Page", () => {
    it("renders footer", () => {
      render(<Footer />);
      // check if all components are rendered
      expect(screen.getByText('Despre Sickst')).toBeInTheDocument();
    });
});