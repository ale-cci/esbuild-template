import main from './index'

describe('the main function', () => {
  it('should test the function', () => {
    expect(main.a(3, 4)).toBe(7)
  })
})
