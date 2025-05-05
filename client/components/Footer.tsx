// "use client";

/**
 * Footer component for the application.
 * @returns {JSX.Element} The rendered footer component.
 */
export const Footer = () => {
    return (
        <footer className="mt-12 py-4 text-center border-t">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Expense App. All rights reserved.</p>
        </footer>
    );
};


