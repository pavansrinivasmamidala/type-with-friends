<script>

    import io from 'socket.io-client';

    const socket = io('http://localhost:3001')    
    socket.emit('message', 'test input');
</script>