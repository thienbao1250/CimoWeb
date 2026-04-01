import CryptoJS from 'crypto-js';

class LocalStorageService {
    private secretKey: string = `}2dvf:U#./28]FLDp2".S>@'EH^)cc)JOQH`;
    private secretKeyForKey: string = `62$zT]9]`;

    // Mã hóa dữ liệu với key bổ sung
    private encrypt(data: string, key: string): string {
        const combinedKey = this.secretKey + key;
        return CryptoJS.AES.encrypt(data, combinedKey).toString();
    }

    // Giải mã dữ liệu với key bổ sung
    private decrypt(encryptedData: string, key: string): string | null {
        try {
            const combinedKey = this.secretKey + key;

            const bytes = CryptoJS.AES.decrypt(encryptedData, combinedKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    // Mã hóa key bằng hàm hash (SHA256)

    private encryptKey(key: string): string {
        const currentDate = new Date().toISOString().split('T')[0];
        const input = `${this.secretKeyForKey}${key}${currentDate}`;
        return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex).substring(0, 10);
    }

    // Lấy giá trị từ localStorage với key mã hóa
    public getItem<T>(key: string, defaultValue: T): T {
        const encryptedKey = this.encryptKey(key);
        const storedValue = localStorage.getItem(encryptedKey);

        if (storedValue === null) {
            return defaultValue;
        }

        const decryptedValue = this.decrypt(storedValue, key);
        if (decryptedValue === null) {
            return defaultValue;
        }

        try {
            return JSON.parse(decryptedValue) as T;
        } catch (error) {
            console.error('Parsing failed:', error);
            return defaultValue;
        }
    }

    // Lưu giá trị vào localStorage với key và value mã hóa
    public setItem<T>(key: string, value: T): void {
        try {
            const encryptedKey = this.encryptKey(key);
            const serializedValue = JSON.stringify(value);
            const encryptedValue = this.encrypt(serializedValue, key);

            localStorage.setItem(encryptedKey, encryptedValue);
        } catch (error) {
            console.error('Failed to set item:', error);
        }
    }

    // Xóa một key khỏi localStorage
    public removeItem(key: string): void {
        const encryptedKey = this.encryptKey(key);
        localStorage.removeItem(encryptedKey);
    }

    // Xóa toàn bộ dữ liệu trong localStorage
    public clear(): void {
        localStorage.clear();
    }
}

export default new LocalStorageService();
