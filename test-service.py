#!/usr/bin/env python3
"""
Test Service for StackPilot Dashboard
This service prints system information every 5 seconds
"""

import time
import sys
import platform
import psutil
from datetime import datetime

def print_system_info():
    """Print system information to stdout"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Get system info
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    print(f"[{timestamp}] System Status Report")
    print(f"  Platform: {platform.system()} {platform.release()}")
    print(f"  CPU Usage: {cpu_percent}%")
    print(f"  Memory: {memory.percent}% used ({memory.used / (1024**3):.2f} GB / {memory.total / (1024**3):.2f} GB)")
    print(f"  Disk: {disk.percent}% used ({disk.used / (1024**3):.2f} GB / {disk.total / (1024**3):.2f} GB)")
    print("-" * 60)
    sys.stdout.flush()  # Ensure output is sent immediately

def main():
    print("=== StackPilot Test Service Started ===")
    print(f"Starting at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("This service will report system info every 5 seconds")
    print("=" * 60)
    sys.stdout.flush()
    
    counter = 0
    try:
        while True:
            counter += 1
            print(f"\n--- Report #{counter} ---")
            print_system_info()
            time.sleep(5)
    except KeyboardInterrupt:
        print("\n=== Service Stopped by User ===")
        sys.exit(0)
    except Exception as e:
        print(f"ERROR: {str(e)}", file=sys.stderr)
        sys.stderr.flush()
        sys.exit(1)

if __name__ == "__main__":
    main()
