// Simple function to test
const getGreeting = () => {
    return "Hello, World!";
};

describe('Hello World Test Suite', () => {
    test('should return Hello, World!', () => {
        expect(getGreeting()).toBe("Hello, World!");
    });
}); 