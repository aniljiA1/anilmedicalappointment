let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join-dashboard', () => {
      socket.join('dashboard');
      console.log(`📊 Dashboard joined: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}

function emitNewAppointment(appointment) {
  if (ioInstance) {
    ioInstance.to('dashboard').emit('new-appointment', appointment);
  }
}

function emitCallUpdate(callData) {
  if (ioInstance) {
    ioInstance.to('dashboard').emit('call-update', callData);
  }
}

function emitActiveCall(callData) {
  if (ioInstance) {
    ioInstance.to('dashboard').emit('active-call', callData);
  }
}

function emitCallEnded(callSid) {
  if (ioInstance) {
    ioInstance.to('dashboard').emit('call-ended', { callSid });
  }
}

module.exports = { initSocket, emitNewAppointment, emitCallUpdate, emitActiveCall, emitCallEnded };
