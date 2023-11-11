/*
 * @Author: Vector-Hope 297893@whut.edu.cn
 * @Date: 2023-10-11 16:47:14
 * @LastEditors: Vector-Hope 297893@whut.edu.cn
 * @LastEditTime: 2023-11-11 16:11:06
 * @FilePath: \convertor-report\src\App.test.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
