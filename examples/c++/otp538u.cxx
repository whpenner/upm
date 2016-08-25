/*
 * Author: Jon Trulson <jtrulson@ics.com>
 * Copyright (c) 2014 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#include <unistd.h>
#include <iostream>
#include <iomanip>
#include <stdexcept>
#include <signal.h>
#include "otp538u.hpp"

using namespace std;

bool shouldRun = true;

// analog voltage, usually 3.3 or 5.0
#define OTP538U_AREF   5.0

void sig_handler(int signo)
{
  if (signo == SIGINT)
    shouldRun = false;
}

int main()
{
  signal(SIGINT, sig_handler);

//! [Interesting]

  // Instantiate a OTP538U on analog pins A0 and A1
  // A0 is used for the Ambient Temperature and A1 is used for the
  // Object temperature.
  upm::OTP538U *temps = new upm::OTP538U(0, 1, OTP538U_AREF);
  
  // enable debugging if you would like
  // temps->setDebug(true);

  // Output ambient and object temperatures
  while (shouldRun)
    {
      try {
        cout << "Ambient temp: " << std::fixed << setprecision(2)
             << temps->ambientTemperature()
             << " C, Object temp: " << temps->objectTemperature()
             << " C" << endl;
      }
      catch (std::out_of_range& e) {
        cerr << "Temperature(s) are out of range: " << e.what()
             << endl;
      }

      cout << endl;
      sleep(1);
    }
//! [Interesting]

  cout << "Exiting" << endl;

  delete temps;
  return 0;
}