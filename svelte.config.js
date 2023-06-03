import vercel from '@sveltejs/adapter-vercel';

const config = {
    kit: {
        adapter: vercel({
            esbuild: {
                target: 'node18'
            }
        }),
    }
};

export default config;
