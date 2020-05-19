// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// TODO(hurwitz): Delete this once create-react-app uses Jest 25.
import MutationObserver from '@sheerun/mutationobserver-shim';
window.MutationObserver = MutationObserver;
