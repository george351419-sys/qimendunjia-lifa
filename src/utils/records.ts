import { ItemType } from './analysis';

export type FeedbackAccuracy = '' | '准' | '不准';

export interface PanRecordParams {
  content: string;
  type: ItemType;
  date: string;
  time: string;
}

export interface PanFeedback {
  accuracy: FeedbackAccuracy;
  text: string;
}

export interface PanRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  params: PanRecordParams;
  feedback: PanFeedback;
}

const STORAGE_KEY = 'qimen_pan_records_v1';

const isBrowser = () => typeof window !== 'undefined';

export function loadRecords(): PanRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: PanRecord[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function upsertRecord(record: PanRecord) {
  const records = loadRecords();
  const index = records.findIndex(item => item.id === record.id);
  const nextRecords = index >= 0
    ? records.map(item => item.id === record.id ? record : item)
    : [record, ...records];
  saveRecords(nextRecords);
  return nextRecords;
}

export function createRecord(params: PanRecordParams, feedback: PanFeedback): PanRecord {
  const now = new Date().toISOString();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
    params,
    feedback,
  };
}
