/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
}

export const NOTE_COLORS = [
  { name: 'Default', value: 'bg-white border-gray-200' },
  { name: 'Red', value: 'bg-red-50 border-red-100' },
  { name: 'Orange', value: 'bg-orange-50 border-orange-100' },
  { name: 'Yellow', value: 'bg-yellow-50 border-yellow-100' },
  { name: 'Green', value: 'bg-green-50 border-green-100' },
  { name: 'Teal', value: 'bg-teal-50 border-teal-100' },
  { name: 'Blue', value: 'bg-blue-50 border-blue-100' },
  { name: 'Purple', value: 'bg-purple-50 border-purple-100' },
  { name: 'Pink', value: 'bg-pink-50 border-pink-100' },
];
