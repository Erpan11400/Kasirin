import { useState } from 'react';

export default function Testing() {
    const [file, setFile] = useState<File | null>(null);
    const [folderId, setFolderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    console.log(file)

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!file) return alert('Pilih file terlebih dahulu!');

        setLoading(true);
        setError('');
        setResult(null);

        // Bikin objek FormData
        const formData = new FormData();
        formData.append('file', file);
        if (folderId) formData.append('folderId', folderId);

        try {
            const response = await fetch('http://localhost:3000/api/upload-drive', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setResult(data.data);
            } else {
                setError(data.message || 'Upload gagal.');
            }
        } catch (err) {
            setError('Gagal terhubung ke server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px' }}>
            <h3>Upload File ke Google Drive</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input type="file" className='p-2 border border-amber-300' onChange={handleFileChange} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Folder ID (Opsional)"
                        value={folderId}
                        onChange={(e) => setFolderId(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {result && (
                <div style={{ marginTop: '15px' }}>
                    <p>✅ <b>Berhasil Diunggah!</b></p>
                    <a href={result.viewLink} target="_blank" rel="noopener noreferrer">
                        Lihat File di Google Drive
                    </a>
                </div>
            )}
        </div>
    );
}