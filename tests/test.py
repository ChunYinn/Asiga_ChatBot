import unittest
from unittest import mock
from unittest.mock import patch

import sys
sys.path.append("..")

from src.chatpgt import *


class Test_input_output(unittest.TestCase):
    @patch('src.chatpgt.get_input')
    @patch('src.chatpgt.parse_input')
    @patch('src.chatpgt.give_output')
    def test_empty_input(self, give_out, parse_in, get_in):
        get_in.return_value = ""
        parse_in.return_value = "It seems that you sent an empty message, please try again."
        give_out.return_value = 1
        self.assertEqual(input_output(), "It seems that you sent an empty message, please try again.")

    @patch('src.chatpgt.get_input')
    @patch('src.chatpgt.parse_input')
    @patch('src.chatpgt.give_output')
    def test_basic_input(self, give_out, parse_in, get_in):
        get_in.return_value = "Hello"
        parse_in.return_value = "Hello. Are there any technical support issues I can assist you with today?"
        give_out.return_value = 1
        self.assertEqual(input_output(), "Hello. Are there any technical support issues I can assist you with today?")

    @patch('src.chatpgt.get_input')
    @patch('src.chatpgt.parse_input')
    @patch('src.chatpgt.give_output')
    def test_parse_failure(self, give_out, parse_in, get_in):
        get_in.return_value = "Hola"
        parse_in.return_value = None
        give_out.return_value = 0
        self.assertEqual(input_output(), None)

    @patch('src.chatpgt.get_input')
    @patch('src.chatpgt.parse_input')
    @patch('src.chatpgt.give_output')
    def test_output_failure(self, give_out, parse_in, get_in):
        get_in.return_value = "Hello"
        parse_in.return_value = "Hi"
        give_out.return_value = 0
        self.assertEqual(input_output(), None)






if __name__ == '__main__':
    unittest.main()
